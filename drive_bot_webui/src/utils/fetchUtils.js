import { serverURL } from '../config'


export const backendFetch = ({url, options}) => {
    const initData = window?.Telegram?.WebApp?.initData || ""
    
    console.log('initData', initData)
    // if (!initData) {
    //   throw new Error('no Telegram initData')
    // }
    const Options = {
      "Content-Type": 'application/json',
      telegramInitData: initData,
    }
  
    const headers = options?.headers || {}
    console.log('aaaa', `${serverURL}${url}`, options)

    return fetch(`${serverURL}${url}`, {
      ...options, 
      headers: {
        ...headers,
        ...Options
      }
    })
  }