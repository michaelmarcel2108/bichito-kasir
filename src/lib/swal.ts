import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1a1d2d',
  color: '#f8fafc',
  iconColor: '#6366f1',
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const AppModal = MySwal.mixin({
  background: '#0f111a',
  color: '#f8fafc',
  confirmButtonColor: '#6366f1',
  cancelButtonColor: '#ef4444',
  customClass: {
    popup: 'glass-panel',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});
