document.body.addEventListener('click', ({ target }) => {
  if (target.classList.contains('copy')) {
    navigator.clipboard.writeText(target.parentElement.lastChild.textContent)
  }
})
