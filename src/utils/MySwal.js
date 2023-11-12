import swal from "sweetalert2";

const didOpenMessage = (e) => {
  if (typeof e?.addEventListener === "function") {
    e.addEventListener('mouseenter',swal.stopTimer)
    e.addEventListener('mouseleave',swal.resumeTimer)
  }
  return "";
}

class MySwal {
  loading(msg) {
    return swal.fire({
      title: 'Loading...',
      html: msg || 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => swal.showLoading(),
      scrollbarPadding: false,
    });
  }

  success(params = {}) {
    const config = {
      title: "Success!",
      text: "",
      icon: "success",
      type: "success",
      timer: 2000,
      timerProgressBar: true,
      didOpen: didOpenMessage,
      returnFocus: false,
      heightAuto: true
    }
    if (typeof params === "string") {
      config.text = params;
      params = {}
    }
    return swal.fire({...config,...params})
  }

  error(params = {}) {
    const config = {
      title: "Error!",
      text: "",
      html:"",
      icon: "error",
      // timer: 10000,
      // timerProgressBar: true,
      didOpen: didOpenMessage,
      returnFocus: false,
      heightAuto: true
    }
    if (typeof params === "string") {
      config.text = params;
      params = {}
    }
    return swal.fire({...config,...params})
  }

  warning(params = {}) {
    const config = {
      title: "Warning!",
      text: "",
      icon: "warning",
      // timer: 5000,
      // timerProgressBar: true,
      didOpen: didOpenMessage,
      returnFocus: false,
      heightAuto: true
    }
    if (typeof params === "string") {
      config.text = params;
      params = {}
    }
    return swal.fire({...config,...params})
  }

  info(params = {}) {
    const config = {
      title: "Info!",
      text: "",
      icon: "info",
      // timer: 3000,
      // timerProgressBar: true,
      didOpen: didOpenMessage,
      returnFocus: false,
      heightAuto: true
    }
    if (typeof params === "string") {
      config.text = params;
      params = {}
    }
    return swal.fire({...config,...params})
  }

  confirm(params = {}) {
    const config = {
      title: "Confirmation!",
      text: "",
      icon: "question",
      didOpen: () => "",
      allowEnterKey: true,
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      returnFocus: false,
      heightAuto: true
    };
    if (typeof params === "string") {
      config.text = params;
      params = {}
    }
    return swal.fire({ ...config, ...params });
  }

  confirmProf(params = {}) {
    const config = {
      title: "Confirmation!",
      text: "",
      icon: "question",
      didOpen: () => "",
      allowEnterKey: true,
      showCancelButton: true,
      showDenyButton: true,
      cancelButtonText: "Close",
      denyButtonText: "Print",
      confirmButtonText: "APPROVED",
      returnFocus: false,
      heightAuto: true
    };
    if (typeof params === "string") {
      config.text = params;
      params = {}
    }
    return swal.fire({ ...config, ...params });
  }

  fire(a,b,c,d){
    return swal.fire(a,b,c,d);
  }

  close() {
    swal.close();
  }
}

export const Swal = swal;
export default MySwal;