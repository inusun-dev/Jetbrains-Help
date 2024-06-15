// import {$} from './jquery';

$(document).ready(function () {
    // Set default headers for AJAX requests
    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Function to handle submission of license information
    window.submitLicenseInfo = function () {
        let licenseInfo = {
            licenseeName: $('#licenseeName').val(),
            assigneeName: $('#assigneeName').val(),
            expiryDate: $('#expiryDate').val()
        };
        localStorage.setItem('licenseInfo', JSON.stringify(licenseInfo));
        $('#mask, #form').hide();
    };

    // Function to handle search input
    $('#search').on('input', function (e) {
        $("#product-list").load('/search?search=' + e.target.value);
    });

    // Function to show license form
    window.showLicenseForm = function () {
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        $('#licenseeName').val(licenseInfo?.licenseeName || '光云');
        $('#assigneeName').val(licenseInfo?.assigneeName || '藏柏');
        $('#expiryDate').val(licenseInfo?.expiryDate || '2111-11-11');
        $('#mask, #form').show();
    };

    // Function to show VM options
    window.showVmoptins = function () {
        alert("-javaagent:/(Your Path)/ja-netfilter/ja-netfilter.jar\n" +
            "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED\n" +
            "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED");
    };

    // Function to copy license
    window.copyLicense = async function (e) {
        while (localStorage.getItem('licenseInfo') === null) {
            $('#mask, #form').show();
            await new Promise(r => setTimeout(r, 1000));
        }
        let licenseInfo = JSON.parse(localStorage.getItem('licenseInfo'));
        let productCode = $(e).closest('.card').data('productCodes');
        let data = {
            "licenseName": licenseInfo.licenseeName,
            "assigneeName": licenseInfo.assigneeName,
            "expiryDate": licenseInfo.expiryDate,
            "productCode": productCode,
        };
        $.post('/generateLicense', JSON.stringify(data))
            .then(response => {
                copyText(response)
            });
    };

// Function to copy text to clipboard
    const copyText = async (val) => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(val);
            showMessage('The activation code has been copied', 1);
        } else {
            try {
                const textArea = document.createElement('textarea');
                textArea.value = val;
                // 使text area不在viewport，同时设置不可见
                textArea.style.position = 'fixed';
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.width = '1px';
                textArea.style.height = '1px';
                textArea.style.padding = '0';
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage('The activation code has been copied', 1);
            } catch (error) {
                console.error(error);
                showMessage('The system does not support it, please go to the console to copy it manually', 0);
            }
        }
    };

    function showMessage(message, type) {
        if (type === 0) {
            alert(message)
        } else if (type === 1) {
            console.log("Copied!")
            $(".copyLicense").attr("data-content", "Copied!")
        }
    }

    $(function () {
        $(".copyLicense").on({
            mouseover: function () {
            },
            mouseout: function () {
                console.log("Copy to clipboard")
                $(".copyLicense").attr("data-content", "Copy to clipboard")
            }
        });
    });
});
