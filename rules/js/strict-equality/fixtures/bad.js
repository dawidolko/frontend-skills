const page = new URLSearchParams(location.search).get('page')
if (page == 1) {
  loadFirstPage()
}
export const isEmpty = (value) => value != ''
