const loading = document.querySelector(".loading")

function isLoading(status){
  status?loading.style.display = 'block':loading.style.display = 'none'
}