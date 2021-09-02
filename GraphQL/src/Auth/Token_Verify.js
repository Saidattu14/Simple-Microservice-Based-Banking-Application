import jwt from 'jsonwebtoken'
const gettoken = (request,pid) => {
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

    if (header) {
         var decoded = jwt.verify(header, 'shhhhh');
         var id_tk = jwt.sign(pid, 'shhhhh');
         if(decoded.id == id_tk || decoded.no == id_tk)
         {
             return header;
         }
         else
         {
             return null;
         }
        
    }
    return null
}
export { gettoken as default }