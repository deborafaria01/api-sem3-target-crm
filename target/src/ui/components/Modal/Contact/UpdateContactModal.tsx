/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useContext, useEffect } from "react";
import {
  ModalContainer,
  TwoColumnsContainer,
} from "../ModalStyles/ModalContainer.style";
import { CloseButtonStyled } from "../ModalStyles/CloseButtonModal.style";
import TextFieldMask from "../../Input/TextFieldMask/TextFieldMask";
import Title from "../../Title/Title";
import { Button, Select, MenuItem, Tooltip, InputLabel, FormControl } from "@material-ui/core";
import { CompanyTypes } from "types/Company";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { ModalStyled } from "../ModalStyles/Modal.style";
import ContactContext from "contexts/ContactContext";
import { IContact } from "types/Contact";
import ContactService from "data/services/ContactService";
import { getBrazilianStates, IState } from "data/services/BrazilianStatesApi";
import CompanyService from "data/services/CompanyService";
import { formatPhone } from "data/utils/formatPhone";

const UpdateContactModal = ({ id, setId }) => {
  const {
    updateContactModal,
    useUpdateContactModal,
    useDeleteContactModal,
    getContacts,
  } = useContext(ContactContext);
  const [states, setStates] = useState<IState[]>([]);
  const [companies, setCompanies] = useState<CompanyTypes[]>([]);

  const [time, setTime] = useState(null);

  const [data, setData] = useState<IContact>({
    name: "",
    company_id: "null",
    state: "null",
    city: "",
    email: "",
    phone: "",
  });

  const mySetId = () => {
    setId();
  };

  const getSelectedContact = async () => {
    const data = await ContactService.getContact(id);

    const myResponse = {
      ...data,
      company_id: data.company?.id,
    };

    setData(myResponse);
  };

  useEffect(() => {
    getSelectedContact();
  }, []);

  const getState = async (): Promise<void> => {
    try {
      const response: any = await getBrazilianStates();

      setStates(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateContact = async () => {
    try {
      if (data.name && data.email && data.company_id) {
        await ContactService.updateContact({
          id,
          name: data?.name,
          email: data?.email,
          phone: data?.phone,
          city: data?.city,
          state: data?.state,
          company: data?.company_id,
        });

        await getContacts();
        mySetId();
        useUpdateContactModal();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getState();
  }, []);

  const getCompanies = async () => {
    const companies = await CompanyService.getCompanies();

    setCompanies(companies);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const body = (
    <ModalContainer>
      <Tooltip
        title="Fechar"
        placement="top-start"
        enterDelay={500}
        leaveDelay={100}
      >
        <CloseButtonStyled
          onClick={() => {
            useUpdateContactModal();
            mySetId();
          }}
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </CloseButtonStyled>
      </Tooltip>

      <Title title="Editar contato" />

      <TextFieldMask
        onChange={(event) => setData({ ...data, name: event.target.value })}
        value={data.name}
        label="Nome do contato"
        variant="standard"
        size="small"
        fullWidth
        required
      />
      

      <TextFieldMask
        onChange={(event) => setData({ ...data, email: event.target.value })}
        value={data.email}
        label="Email"
        variant="standard"
        size="small"
        fullWidth
      />

      <TwoColumnsContainer>
        <TextFieldMask
          onChange={(event) => setData({ ...data, phone: event.target.value })}
          value={formatPhone(data.phone)}
          label="Telefone"
          variant="standard"
          size="small"
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel
            variant="standard"
            htmlFor="uncontrolled-native"
          >
            Empresa
          </InputLabel>
          <Select
            onChange={(event) =>
              setData({ ...data, company_id: event.target.value })
            }
            value={data.company_id}
            label="Empresa"
            variant="standard"
            fullWidth
          >
            <MenuItem value={"null"} disabled>
              Selecione a Empresa
            </MenuItem>
            {companies?.map((company) => (
              <MenuItem value={company.id} key={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
      </TwoColumnsContainer>

      <TwoColumnsContainer>
        <TextFieldMask
          onChange={(event) => setData({ ...data, city: event.target.value })}
          value={data.city}
          label="Cidade"
          variant="standard"
          size="small"
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel
            variant="standard"
            htmlFor="uncontrolled-native"
          >
            Estado
          </InputLabel>

          <Select
            onChange={(event) => setData({ ...data, state: event.target.value })}
            value={data.state}
            label="Estado"
            variant="standard"
            fullWidth
          >
            <MenuItem value={"null"} disabled>
              Selecione o estado...
            </MenuItem>
            {states.length > 0
              ? states.map((state) => (
                  <MenuItem key={state.id} value={state.sigla}>
                    {state.sigla}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
      </TwoColumnsContainer>

      <TwoColumnsContainer>
        <Tooltip
          title="Deletar contato"
          placement="top-start"
          enterDelay={500}
          leaveDelay={100}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              useDeleteContactModal(), useUpdateContactModal();
            }}
            startIcon={<DeleteIcon />}
            sx={{ mt: 4 }}
          >
            Deletar
          </Button>
        </Tooltip>
        <Tooltip
          title="Salvar alterações"
          placement="top-start"
          enterDelay={500}
          leaveDelay={100}
        >
          <Button
            variant="contained"
            color="success"
            style={{ color: "white" }}
            onClick={() => updateContact()}
            startIcon={<AddCircleIcon />}
            sx={{ mt: 4 }}
          >
            Salvar
          </Button>
        </Tooltip>
      </TwoColumnsContainer>
    </ModalContainer>
  );
  return (
    <>
      <ModalStyled
        open={updateContactModal}
        onClose={mySetId}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </ModalStyled>
    </>
  );
};

export default UpdateContactModal;
