import axios from '@/config'

export default function request(params) {
  const method = (params.method || 'get').toLocaleLowerCase()
  return new Promise((resolve, reject) => {
    axios[method](params.url, method === 'get' ? { params: params.data } : params.data)
      .then(res => resolve(res.data.data))
      .catch(reject)
  })
}
