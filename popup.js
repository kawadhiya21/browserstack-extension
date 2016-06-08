var masterJson;
var platform;
var final_params;

function get_os_browsers(argument) {
  $.ajax({
    url: 'https://www.browserstack.com/list-of-browsers-and-platforms.json?product=live',
    success: function(data){
      $('#loading').hide();
      var basic = Object.keys(data);
      var dmElements = "";
      dmElements += "<option value='blank'>--Select--</option>";
      basic.forEach(function (ele) {
        dmElements += "<option value='" + ele + "'>" + ele + "</option>";
      });
      $('#dm_view').show();
      $('#dm').html(dmElements);
      $('#dm').on('change', function () {
        var dm = this.value;
        if (dm === "blank") {
          return false;
        }

        if (dm === "desktop") {
          platform = "desktop";
          handle_desktop(data)
        }

        if (dm === "mobile") {
          platform = "mobile";
          handle_mobile(data);
        }
      });
    }
  });
}

function handle_desktop(data) {
  var dElements = "";
  dElements += "<option value='blank'>--Select--</option>";
  data['desktop'].forEach(function (ele) {
    dElements += "<option dm='desktop' value='" + ele.os_display_name + "'>" + ele.os_display_name + "</option>";
  });

  $('#os_view').show();
  $('#os').html(dElements);
  handle_os_change(data);
}

function handle_mobile(data) {
  var dElements = "";
  dElements += "<option value='blank'>--Select--</option>";
  data['mobile'].forEach(function (ele) {
    dElements += "<option dm='mobile' value='" + ele.os_display_name + "'>" + ele.os_display_name + "</option>";
  });

  $('#os_view').show();
  $('#os').html(dElements);
  handle_os_change(data);
}

function handle_os_change(data) {
  $('#os').on('change', function () {
    var os_display_name = this.value;

    if (dm === "blank") {
      return false;
    }

    if(platform === 'desktop') {
      get_desktop_value(data, os_display_name);
    }

    if(platform === 'mobile') {
      get_mobile_value(data, os_display_name);
    }
  });
}

function get_desktop_value(data, os_display_name) {
  var os, os_version, browsers;
  data['desktop'].every(function (ele) {
    if (ele.os_display_name === os_display_name) {
      os = ele.os;
      os_version = ele.os_version;
      browsers = ele.browsers;
      return false;
    }
    return true; 
  });

  var bsElements = "";
  bsElements += "<option value='blank'>--Select--</option>";
  browsers.forEach(function (ele) {
    bsElements += "<option browser='" + ele.browser + "' browser_version='" + ele.browser_version + "' value='" + ele.display_name + "'>" + ele.display_name + "</option>";
  });

  $('#bs_view').show();
  $('#bs').html(bsElements);

  $('#bs').change(function () {
    var browser_name = this.value
    var browser, browser_version;

    if (browser_name === "blank") {
      return false;
    }

    browsers.every(function (ele) {
      if (ele.display_name === browser_name) {
        browser = ele.browser;
        browser_version = ele.browser_version;
        return false;
      }
      return true; 
    });

    get_input_and_submit('desktop', {
      os: os,
      os_version: os_version,
      browser: browser,
      browser_version: browser_version
    });
  });
}

function get_mobile_value(data, os_display_name) {
  var os, devices;
  data['mobile'].every(function (ele) {
    if (ele.os_display_name === os_display_name) {
      os = ele.os;
      devices = ele.devices;
      return false;
    }
    return true; 
  });

  var bsElements = "";
  bsElements += "<option value='blank'>--Select--</option>";
  devices.forEach(function (ele) {
    bsElements += "<option os_version='" + ele.os_version + "' device='" + ele.device + "' value='" + ele.display_name + "'>" + ele.display_name + "</option>";
  });

  $('#bs_view').show();
  $('#bs').html(bsElements);

  $('#bs').change(function () {
    var device_name = this.value
    var device, os_version;

    if (device_name === "blank") {
      return false;
    }

    devices.every(function (ele) {
      if (ele.display_name === device_name) {
        device = ele.device;
        os_version = ele.os_version;
        return false;
      }
      return true; 
    });

    get_input_and_submit('desktop', {
      os: os,
      os_version: os_version,
      device: device
    });
  });
}

function get_input_and_submit(dm, options) {
  $('#final_view').show();
  final_params = options;
}

function final_submit() {
  $('#submit').click(function () {
    final_params['resolution'] = 'responsive-mode';
    final_params['speed'] = 1;
    final_params['start'] = true;
    final_params['scale_to_fit'] = true;
    final_params['url'] = $('#url').val();

    var new_url = "https://www.browserstack.com/start#" + $.param(final_params);
    chrome.tabs.create({ url: new_url });
  });
}


document.addEventListener('DOMContentLoaded', function() {
  get_os_browsers();
  final_submit();
});
