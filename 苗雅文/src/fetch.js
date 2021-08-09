//全局路径
const commonUrl = 'http://39.101.186.248:3000/v1/trade'
//解析json
function parseJSON(response){
  return response.json()
}
//检查请求状态
function checkStatus(response){
  if(response.status >= 200 && response.status < 500){
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export default  function request(options = {}){
  const {url} = options
  return fetch(commonUrl+url)
    .then(checkStatus)
    .then(parseJSON)//处理json数据，返回一个promise
    .catch(err=>({err}))
}