/* eslint-disable prefer-const */
const btn = document.querySelector('#notif')

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    btn.style.opacity = '10'
    notifRemove()
  }, 2000)

  function notifRemove () {
    setTimeout(() => {
      btn.style.opacity = '0'
    }, 3000)
  }
})
