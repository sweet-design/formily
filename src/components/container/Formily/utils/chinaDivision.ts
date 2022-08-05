import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

areas.forEach((area: any) => {
  const matchCity = cities.filter((city: any) => city.code === area.cityCode)[0];
  if (matchCity) {
    matchCity.children = matchCity.children || [];
    matchCity.children.push({
      label: area.name,
      value: area.code,
    });
  }
});

cities.forEach((city: any) => {
  const matchProvince = provinces.filter((province: any) => province.code === city.provinceCode)[0];
  if (matchProvince) {
    matchProvince.children = matchProvince.children || [];
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children,
    });
  }
});

const options = provinces.map((province: any) => ({
  label: province.name,
  value: province.code,
  children: province.children,
}));

export default options;
