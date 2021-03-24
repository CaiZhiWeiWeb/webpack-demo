console.log('i am admin');
const arr1 = [1,2,3,4]
const getArr = ()=>{
  return arr1.filter(el=> el > 2)
}

console.log(getArr());