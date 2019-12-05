let errors = [
    {code:1000,text:'Tài khoản hoặc mật khẩu không đúng.'},
    {code:1001,text:'Đường dẫn không hợp lệ.'},
    {code:1002,text:'Cửa hàng này đã là đối thủ của quý khách.'},
    {code:1003,text:'Không tìm thấy tài khoản sàn được liên kết.'},
    {code:1004,text:'Xảy ra lỗi khi cập nhật giá.'},
    {code:1005,text:'Xảy ra lỗi khi cập nhật tồn kho.'},

];
module.exports =  function(errorCode){
  let error_obj = errors.find(({code}) => errorCode === code);
  if(!error_obj) return {error:'Lỗi không xác định.'};
  return {error:error_obj.text}

};
