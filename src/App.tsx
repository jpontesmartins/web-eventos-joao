import { FormControl, Select, MenuItem, SelectChangeEvent, Grid, TextField, Button, Snackbar, SnackbarContent } from '@mui/material';
import './App.css';
import React, { ChangeEvent, FormEvent, useEffect } from 'react';
import { DatePicker, DateValidationError, LocalizationProvider, PickerChangeHandlerContext } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import axios from 'axios';
import FeedbackMessage from './FeedbackMessage';


function App() {

  const API = "http://localhost:8080"

  const [instituicao, setInstituicao] = React.useState(0);
  const [instituicoes, setInstituicoes] = React.useState([{ id: 0, nome: "" }]);
  const [nome, setNome] = React.useState("");
  const [dataInicial, setDataInicial] = React.useState("");
  const [dataFinal, setDataFinal] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const getInstituicoes = async () => {
    try {
      setMessage("");
      setOpen(false);
      const { data } = await axios({
        url: `${API}/instituicoes`,
        method: 'get',
      });
      setInstituicoes(data);
    } catch (error) {
      setMessage("Sem conexão com a API");
      setOpen(true);
      console.log(error);
    }
  }

  useEffect(() => {
    getInstituicoes();
  }, [])


  const formularioPreenchido = () => {
    setMessage("");
    if (dataFinal === null || dataInicial === null || dataFinal === "" || dataInicial === "") {
      setMessage("Preencha corretamente as datas");
      setOpen(true);
      return false;
    }
    if (moment().format(dataFinal) < moment().format(dataInicial)) {
      setMessage("A data final deve ser posterior a data inicial!");
      setOpen(true);
      return false;
    }
    if (nome === null || nome === "") {
      setMessage("Campo Nome é obrigatório");
      setOpen(true);
      return false;
    }
    if (nome === null || instituicao === 0) {
      setMessage("Campo Instituição é obrigatório");
      setOpen(true);
      return false;
    }

    return true;
  }


  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    if (!formularioPreenchido()) {
      return;
    }

    try {
      const resposta = await axios({
        url: `${API}/eventos`,
        method: 'post',
        data: {
          nome: nome,
          instituicao: instituicao,
          dataInicial: dataInicial,
          dataFinal: dataFinal
        },
      });

      const { data } = resposta;
      const message = `Evento ${data.nome} cadastrado com sucesso!`
      setMessage(message);
      setOpen(true);
    } catch (error) {
      console.log(error);
      setOpen(true);
      setMessage("Erro!");
    }

  }

  const handleChange_Instituicao = (event: SelectChangeEvent) => {
    setInstituicao(+event.target.value);
  };

  const handleChange_NomeEvento = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNome(event.target.value);
  }

  const handleChange_DataInicial = (value: any, context: PickerChangeHandlerContext<DateValidationError>) => {
    setDataInicial(value !== null ? value.format() : "");
  }

  const handleChange_DataFinal = (value: any, context: PickerChangeHandlerContext<DateValidationError>) => {
    setDataFinal(value !== null ? value.format() : "");
  }

  return (
    <div className="App-header">
      <p>Web Eventos Joao</p>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Grid container width={700} spacing={2}>
          
          {/* INSTITUICAO */}
          <Grid item md={6} xs={6}>
            Instituição:
          </Grid>
          <Grid item md={6} xs={6}>
            <Select id="selectInstituicao" value={instituicao + ""}
              onChange={handleChange_Instituicao} autoWidth
              style={{ backgroundColor: "#FFF", minWidth: 250 }}>
              {instituicoes.map((item, i) =>
                <MenuItem key={i} value={item.id}>{item.nome}</MenuItem>
              )}
            </Select>
          </Grid>

          {/* NOME DO EVENTO */}
          <Grid item md={6} xs={6}>
            Nome do evento:
          </Grid>
          <Grid item md={6} xs={6}>
            <TextField id="tfNomeEvento" onChange={handleChange_NomeEvento} />
          </Grid>

          {/* DATA INICIAL */}
          <Grid item md={6} xs={6}>
            Data inicial
          </Grid>
          <Grid item md={6} xs={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker onChange={handleChange_DataInicial} format="DD/MM/YYYY" />
            </LocalizationProvider>
          </Grid>

          {/* DATA FINAL */}
          <Grid item md={6} xs={6}>
            Data Final
          </Grid>
          <Grid item md={6} xs={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker onChange={handleChange_DataFinal} format="DD/MM/YYYY" />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Grid item md={12}>
          <Button variant="contained" onClick={handleSubmit}>Salvar evento</Button>
        </Grid>
      </FormControl>
      <div>
        <hr></hr>
      </div>

      <div>
        Listagem dos eventos
      </div>
      
      <FeedbackMessage message={message} open={open} setOpen={setOpen} setMessage={setMessage}/>
    </div>
  );
}

export default App;
