import React from "react";
import ScrumBoard from "data/services/servicesComponents/ScrumBoard";
import { usePipelineComponent } from "data/services/hooks/componentHooks/PipelineHook";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import {
  DealsHeaderContainer,
  DealsPageContainer,
  DealsTotalTagsContainer,
  PipelinesContainer,
} from "@styles/pagesStyle/deals.style";
import Title from "ui/components/Title/Title";
import TextFieldMask from "ui/components/Input/TextFieldMask/TextFieldMask";

function DealPipeline() {
  const { hasError, isLoading } = usePipelineComponent();
  return (
    <DealsPageContainer>
      <DealsHeaderContainer>
        <div>
          <Title
            title="PIPELINE"
            subtitle={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Typography>R$ 12.257,75</Typography>
                <i
                  className="fa fa-arrow-right"
                  style={{ position: "relative", top: "2px" }}
                ></i>
                <Typography>8 negociações</Typography>
              </div>
            }
          ></Title>
          <DealsTotalTagsContainer>
            <div>
              <i className="fa fa-fire" style={{ color: "#e63706" }}></i>
              <span> 5</span>
            </div>
            <div>
              <i className="fa fa-bolt" style={{ color: "#effa5c" }}></i>
              <span> 4</span>
            </div>
            <div>
              <i className="fa fa-snowflake-o" style={{ color: "#3eccf0" }}></i>
              <span> 2</span>
            </div>
          </DealsTotalTagsContainer>
        </div>
        <TextFieldMask
          fullWidth
          label={"Buscar"}
          variant={"outlined"}
          icon="fa fa-search"
          type="text"
          size="small"
          value=""
          onChange={(event) => {}}
        ></TextFieldMask>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {}}
          type="submit"
          sx={{ height: "40px", margin: "auto" }}
          startIcon={<i className="fa fa-archive"></i>}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Aquivados"
          )}
        </Button>
      </DealsHeaderContainer>
      <PipelinesContainer>
        {isLoading ? (
          <CircularProgress />
        ) : !isLoading && hasError ? (
          <div>{hasError}</div>
        ) : (
          <ScrumBoard />
        )}
      </PipelinesContainer>
    </DealsPageContainer>
  );
}

export default DealPipeline;
