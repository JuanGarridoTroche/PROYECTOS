import ('../../css/Message.css')
export const Message = ({message, type}) => {
// type =error / data
// console.log(message, type);

return (
  <p className={`p--${type}-message`}>{message}</p>
)  
  
}