import { Button, Snackbar } from '@mui/material';
import './App.css';

function FeedbackMessage(props: { open: any, setOpen: any, message: any, setMessage: any }) {

  return (
      <Snackbar
        action={<Button size="small" style={{ color: "#CCC" }} onClick={() => props.setOpen(false)}>
          Ok
        </Button>}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={props.open}
        autoHideDuration={6000}
        onClose={() => props.setOpen(false)}
        message={props.message} />
  );
}

export default FeedbackMessage;
