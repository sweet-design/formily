import xhr from '@/service';

export const getAllRoleInfo = (body: any) =>
  xhr({
    url: 'ees.organizational.menuinfo.rolemodule',
    body,
    method: 'post',
  });

export const getBusinessTypeData = (params: any) =>
  xhr({
    url: 'ees.eff.uploadinfo.template',
    params,
    method: 'get',
  });

export const formSubmit = (params: any) =>
  xhr({
    url: 'ees.eff.uploadinfo.template',
    params,
  });

export const getUserList = (params: any) =>
  xhr({
    url: 'userList/get',
    params,
    method: 'get',
  });

export const getUserDetail = (params: any) =>
  xhr({
    url: 'getUser/getUserDetail',
    params,
  });

export const getDictData = (params: any) =>
  xhr({
    url: 'ees.common.dict.other',
    params,
    method: 'get',
  });

/**
 * 下拉列表选择器搜索
 * @param body 参数对象
 * @returns 指定类型下的列表
 */
export const DropDownSelectSearch = (body: any) =>
  xhr({
    url: 'Basic.Selector.GetDropDownSelectorData',
    body,
  });

/**
 * 人员选择器搜索
 * @param body 模糊搜索关键字
 * @returns 人员列表
 */
export const UserSelectorSearch = (body: any) =>
  xhr({
    url: 'Basic.Selector.GetEmpSelectorData',
    body,
  });

/**
 * 加载树形数据
 * @param data
 * @returns 指定类型的树形数据
 */
export const LoadTreeData = (body: any) =>
  xhr({
    url: 'Basic.Tree.LoadTreeData',
    body,
  });
