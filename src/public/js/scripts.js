let birthDate = document.getElementById('birthDate')

birthDate.addEventListener('change',(e)=>{
  let birthDateVal = e.target.value
  document.getElementById('startDateSelected').innerText = birthDateVal
})