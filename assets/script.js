for (const node of document.getElementsByClassName('code-block')) {
  const [pre] = node.getElementsByTagName('pre')
  const button = document.createElement('button')
  button.append('copy')
  button.type = 'button'
  button.classList.add('copy')
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(pre.textContent)
  })
  node.append(button)
}
