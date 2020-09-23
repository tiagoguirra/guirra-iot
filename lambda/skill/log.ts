export const Log = (action: string, value: any = {}) => {
  console.log(action, JSON.stringify(value))
}
