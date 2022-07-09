import service from '@/service';

/**
 * 读取文件大小
 * @param size 文件大小 单位字节
 */
export const getSize = (size: number) => {
  return size > 1024
    ? size / 1024 > 1024
      ? size / (1024 * 1024) > 1024
        ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        : (size / (1024 * 1024)).toFixed(2) + 'MB'
      : (size / 1024).toFixed(2) + 'KB'
    : size.toFixed(2) + 'B';
};

/**
 * 文件提交，支持分片提交
 * @param param.file 文件流对象
 * @param param.guid 文件唯一编号ID
 * @param param.name 文件名
 * @param extra.chunked 是否分片上传
 * @param extra.chunks 总片数
 * @param onProgress 进度条回调函数
 * @param url 上传地址
 */
export const postFile = (param: any, extra: any, onProgress: Function, url: string): any => {
  const formData = new FormData(); // 实例化文件上传业务参数
  for (const p in param) {
    if (p != 'file' && p != 'data') {
      formData.append(p, param[p]);
    }
  }

  const config = {
    onUploadProgress: (e: any) => {
      if (!extra.chunked || extra.chunks == 1) {
        e.percent = Number(((e.loaded / e.total) * 100).toFixed(2));
      } else {
        e.percent = Number(
          (((extra.chunk * (extra.eachSize - 1) + e.loaded) / extra.fullSize) * 100).toFixed(2),
        );
      }

      onProgress(e);
    },
  };

  return service({
    url: url,
    file: param.file || param.data,
    params: formData,
    onUploadProgress: config.onUploadProgress,
  }).then((response: any) => {
    return response;
  });
};

/**
 * 文件单个上传
 * @param file 文件流对象
 * @param data 业务层自定义参数对象
 * @param onProgress 上传组件原生进度函数
 * @param url 上传地址
 */
export const singleUpload = (
  file: File,
  data: Record<string, any>,
  onProgress: Function,
  url: string,
) => {
  return postFile(
    Object.assign(
      {
        file: file,
      },
      data,
    ),
    {
      chunked: false,
    },
    onProgress,
    url,
  );
};

/**
 * 文件分片
 * @param file 文件流对象
 * @param eachSize 分片基数
 * @param chunks 总片数
 * @returns fileChunk 分片后的数组集合
 */
export const splitFile = (file: any, eachSize: number, chunks: number) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const fileChunk = []; // 分片后的数组
        for (let chunk = 0; chunks > 0; chunks--) {
          fileChunk.push(file.slice(chunk, chunk + eachSize));
          chunk += eachSize;
        }

        resolve(fileChunk);
      }, 0);
    } catch (e) {
      reject(new Error('文件分片发生错误'));
    }
  });
};

/**
 * 文件分片上传
 * @param file 上传的文件对象
 * @param data 上传时所附带的额外参数
 * @param onProgress 上传进度回调函数
 * @param url 上传地址
 * @param eachSize 分片上传时每片的文件大小 单位 字节
 */
export async function splitUpload(
  file: any,
  data: any,
  onProgress: Function,
  url: string,
  eachSize: number,
) {
  try {
    const chunks = Math.ceil(file.size / eachSize); // 总片数
    const fileChunks: any = await splitFile(file, eachSize, chunks); // 分片之后的数组集合

    let currentChunk = 0; // 当前分片的索引
    for (let i = 0; i < fileChunks.length; i++) {
      if (Number(currentChunk) === i) {
        const obj = await postFile(
          Object.assign(
            {
              chunk: i + 1, // 当前分片的索引在加一
              total: chunks, // 总片数
              name: file.name, // 文件名
              guid: file.uid, // 文件编号
              data: fileChunks[i], // 当前分片文件对象
            },
            data,
          ),
          {
            chunked: true, // 是否分片上传
            chunk: i, // 当前分片的索引
            chunks: chunks, // 总片数
            eachSize: eachSize, // 每片文件大小
            fullSize: file.size, // 文件总大小
          },
          onProgress,
          url,
        );

        currentChunk = obj.data.chunk;

        if (obj.data.complete) return obj;
      }
    }
  } catch (e) {
    console.log(e);
  }
}
