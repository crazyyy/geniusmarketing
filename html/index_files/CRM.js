var $ = jQuery.noConflict();

 

$(function(){

  
    
    function ExportToCRM(name, email, phone, sub_form) {
        sub_form = sub_form || "";
        var output = false;
        $.ajax({
            type: "POST",
            url: 'http://geniusmarketing.me/crm/export.php',
            data: {
                name: name,
                email: email,
                phone: phone,
                sub_form: sub_form
            },
            async: false,
            success: function () {
                output = true;
            }
        });
        return output;
    }


  function ExportToCRM1(name, email, phone) {
        var output = false;
        $.ajax({
            type: "POST",
            url: 'crm/export1.php',
            data: {
                name: name,
                email: email,
                phone: phone,
            },
            async: false,
            success: function () {
                output = true;
            }
        });
        return output;
    }

     function ExportToCRM2(name, email, phone) {
        var output = false;
        $.ajax({
            type: "POST",
            url: 'crm/export2.php',
            data: {
                name: name,
                email: email,
                phone: phone,
            },
            async: false,
            success: function () {
                output = true;
            }
        });
        return output;
    }
});