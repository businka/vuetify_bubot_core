module.exports = {
  findIndexInArrayObj,
  findInArrayObj
}


function findInArrayObj (_array, finding_value, field='id') {
  if (!field) throw new Error('findIndexInArrayObj: field for find not defined')
  return _array.find(function(item){
    return item[field] === finding_value
  })
}

function findIndexInArrayObj (_array, finding_value, field='id') {
  if (!field) throw new Error('findIndexInArrayObj: field for find not defined')
  return _array.findIndex(function(item){
    return item[field] === finding_value
  })
}
