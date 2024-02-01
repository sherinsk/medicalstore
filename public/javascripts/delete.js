 function deleteitem()
 {
  
    fetch("/user/dashboard/delete/"+event.target.getAttribute('dataid'),{method:'DELETE',headers:{'Content-Type':'application/json'}})
    .then(response =>{
      if(!response.ok)
      {
        throw new Error('Network response was not ok')
      }
      console.log('Data deleted successfully');
      location.reload()
    })
    .catch(error => console.log(error))
  }