function dropdown() {
  try { 
    const checkbox1 = document.querySelector('#checkbox1');
    const checkbox2 = document.querySelector('#checkbox2');
    const toggle1 = document.querySelector('.toggle1')
    const toggle2 = document.querySelector('.toggle2')
  
    const arr = [checkbox1, checkbox2];
    arr.map(box => {
      box.onchange = function drop() {
        if(this.checked) { 
          if (this.id === 'checkbox1') {
            if(toggle1) toggle1.style.display = 'block';
          }
          if (this.id === 'checkbox2') {
            if (toggle2) toggle2.style.display = 'block';
          }
        } else {
          if (this.id === 'checkbox1') {
            if(toggle1) toggle1.style.display = 'none';
          }
          if (this.id === 'checkbox2') {
            if (toggle2) toggle2.style.display = 'none';
          }
        }
      }
    });
  } catch(error) {
    console.log(error)
  }
}

dropdown();