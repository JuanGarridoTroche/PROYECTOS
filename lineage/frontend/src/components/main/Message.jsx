import ('../../css/Message.css')
export const Message = ({message, type}) => {
// type =error / data

return (
  <p className={`p__${type}-message`}>{message}</p>
)  
  
}