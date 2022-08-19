import axios from '@/config'

export function useRequest(params) {
  const method = (params.method || 'get').toLocaleLowerCase()
  return new Promise((resolve, reject) => {
    axios[method](params.url, method === 'get' ? { params: params.data } : params.data)
      .then(resolve)
      .catch(reject)
  })
}
