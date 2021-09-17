import PipelineService from "data/services/PipelineService";
import React, { useState, createContext } from "react";
import { DealTypes } from "types/Deal";
import ModalTypes from "types/Modal";

const ModalContext = createContext<ModalTypes>({} as ModalTypes);

export const ModalProvider: React.FC = ({ children }) => {
  const [createModalState, setCreateModalState] = useState<boolean>(false);
  const [updateModalState, setUpdateModalState] = useState<boolean>(false);
  const [deleteModalState, setDeleteModalState] = useState<boolean>(false);
  const [createDealModalState, setCreateDealModalState] = useState<boolean>(false);
  const [updateId, setUpdateIdState] = useState<string>();
  const [deleteId, setDeleteIdState] = useState<string>();
  const [name, setNameState] = useState<string>();

  const useCreateModal = () => {
    setCreateModalState(!createModalState);
  };

  const useCreateDealModal = () => {
    setCreateDealModalState(!createDealModalState);
  };

  const useUpdateModal = (id: string) => {
    setUpdateIdState(id);
    setUpdateModalState(!updateModalState);
  };

  const useDeleteModal = (id: string) => {
    setDeleteIdState(id);
    setDeleteModalState(!deleteModalState);
  };

  const setName = (name: string) => {
    setNameState(name);
  };

  const deletePipeline = async () => {
    await PipelineService.deletePipeline(deleteId);
    useDeleteModal("");
  };

  const updatePipeline = async () => {
    await PipelineService.updatePipeline(updateId, name);
    useUpdateModal("");
  };

  const createPipeline = async () => {
    await PipelineService.createPipeline(name);
    useCreateModal();
  };

  const createDeal = async (data: DealTypes) => {
    await PipelineService.createDeal(data);
    useCreateDealModal();
  };


  return (
    <ModalContext.Provider
      value={{
        createModalState,
        useCreateModal,
        updateModalState,
        useCreateDealModal,
        createDealModalState,
        useUpdateModal,
        deleteModalState,
        useDeleteModal,
        deletePipeline,
        updatePipeline,
        createPipeline,
        setName,
        createDeal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
