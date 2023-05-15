import ('../../css/Message.css')
export const Message = ({message, type}) => {
// type =error / data

return (
  <p className={`p--${type}-message`}>{message}</p>
)  
  
}