import React, { useEffect, useState } from "react";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@material-ui/core";
import { DynamicBarCharts } from "data/services/servicesComponents/DynamicBarCharts";
import { DynamicPieCharts } from "data/services/servicesComponents/DynamicPieCharts";
import TextFieldMask from "ui/components/Input/TextFieldMask/TextFieldMask";
import {
  ChartsContainer,
  DashboardHeaderContainer,
  DashboardPageContainer,
  DatePickerContainer,
} from "@styles/pagesStyle/dashboard.style";
import DealsInfoCard from "../ui/components/DealsInfoCard/DealsInfoCardComponent";
import ConversionRateCard from "../ui/components/ConversionRateCardComponent/ConversionRateCardComponent";
import { useDashboardPage } from "../data/services/hooks/PageHooks/DashboardHook";
import Title from "ui/components/Title/Title";
import { formatArray } from "data/utils/formatArray";
import Head from "next/head";
import { DynamicTestLineCharts } from "data/services/servicesComponents/DynamicTestLineCharts";
import { GetServerSideProps } from "next";
import { parseCookies } from "data/services/cookie";
import { serviceApi } from "data/services/ServiceApi";
import { DealTypes } from "types/Deal";

interface BarChartsProps {
  title: string;
  xaxis: string[];
  series: { name: string; data: number[] }[];
}

interface DashboardProps {
  allDeals: DealTypes[];
  token: string;
}

function Dashboard({ allDeals, token }: DashboardProps) {
  serviceApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    if (allDeals) {
      getDealsInfo(allDeals);
      getConversionRateCardInfo(allDeals);
      getTestLineChartData(allDeals);
    }
  }, []);

  const {
    wonDeals,
    lostDeals,
    inProgressDeals,
    archivedDeals,
    dealsInfo,
    getDealsInfo,
    conversionRateInfo,
    getConversionRateCardInfo,
    getData,
    deals,
    // setAllDeals,
    getTestLineChartData,
    testLineChartData,
  } = useDashboardPage();

  //* Mock para visualização {

  const mock = [
    {
      value: 131542,
      status: "WON",
      updatedAt: "2021-11-01T17:38:44.873Z",
    },
    {
      value: 231343,
      status: "WON",
      updatedAt: "2021-11-02T17:38:44.873Z",
    },
    {
      value: 312761,
      status: "WON",
      updatedAt: "2021-11-03T17:38:44.873Z",
    },
    {
      value: 459832,
      status: "WON",
      updatedAt: "2021-11-04T17:38:44.873Z",
    },
    {
      value: 112122,
      status: "WON",
      updatedAt: "2021-11-05T17:38:44.873Z",
    },
    {
      value: 231342,
      status: "WON",
      updatedAt: "2021-11-05T17:38:44.873Z",
    },
    {
      value: 546432,
      status: "LOST",
      updatedAt: "2021-11-01T17:38:44.873Z",
    },
    {
      value: 345354,
      status: "LOST",
      updatedAt: "2021-11-02T17:38:44.873Z",
    },
    {
      value: 226512,
      status: "LOST",
      updatedAt: "2021-11-03T17:38:44.873Z",
    },
    {
      value: 453113,
      status: "LOST",
      updatedAt: "2021-11-04T17:38:44.873Z",
    },
    {
      value: 212772,
      status: "LOST",
      updatedAt: "2021-11-05T17:38:44.873Z",
    },
  ];

  const x = [
    "November 5, 2021",
    "November 6, 2021",
    "November 7, 2021",
    "November 8, 2021",
    "November 9, 2021",
    "November 11, 2021",
    "November 12, 2021",
    "November 13, 2021",
    "November 14, 2021",
    "November 15, 2021",
    "November 16, 2021",
    "November 17, 2021",
  ];

  const s = [
    {
      name: "Ganha",
      data: [
        2432, 4654, 5912, 4342, 5982, 7354, 3370, 6609, 9904, 1323, 5434, 8767,
      ],
    },
    {
      name: "Perdida",
      data: [
        3301, 6660, 9990, 1323, 5434, 8767, 3432, 6654, 9912, 4342, 5982, 7354,
      ],
    },
  ];
  //* Fim do Mock }

  const [filterType, setFilterType] = useState<{
    chartType: string;
    valueType: string;
  }>({ chartType: "Empresa", valueType: "quantidade" });

  const [filterDate, setFilterDate] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  const [chartData, setChartsData] = useState<BarChartsProps>({
    title: "",
    xaxis: [""],
    series: [],
  });

  const getChartData = (chartType: string, valueType: string) => {
    const data = formatArray(deals, chartType);
    setChartsData({
      title: `${chartType} X ${valueType}`,
      xaxis: data?.dataNames,
      series: [
        {
          name: "GANHAS",
          data:
            valueType === "valor"
              ? data?.dataValues?.wonValue
              : data?.dataLength?.won,
        },
        {
          name: "EM ANDAMENTO",
          data:
            valueType === "valor"
              ? data?.dataValues?.inProgressValue
              : data?.dataLength?.inProgress,
        },
        {
          name: "PERDIDAS",
          data:
            valueType === "valor"
              ? data?.dataValues?.lostValue
              : data?.dataLength?.lost,
        },
      ],
    });
  };

  useEffect(() => {
    getChartData("Empresa", "quantidade");
  }, [deals]);

  const setFilter = () => {
    if (filterDate?.startDate) {
      const startDate = filterDate?.startDate
        ? new Date(filterDate?.startDate)
        : new Date("1900-11-11");
      getData(startDate);
    }
  };

  return (
    <DashboardPageContainer>
      <Head>
        <title>Dashboard | Target</title>
      </Head>
      <DashboardHeaderContainer>
        <Title style={{ textAlign: "left" }} title="Dashboard"></Title>

        <DatePickerContainer>
          <p> Personalize o grafico</p>
          <div className="buttonEditChart">
            <ToggleButtonGroup
              color="primary"
              value={filterType.chartType}
              exclusive
              onChange={(event, newValue) => {
                if (newValue) {
                  setFilterType({ ...filterType, chartType: newValue });
                  getChartData(newValue, filterType.valueType);
                }
              }}
            >
              <ToggleButton value="Empresa">Empresas</ToggleButton>
              <ToggleButton value="Vendedor">Vendedores</ToggleButton>
              <ToggleButton value="Pipeline">Pipelines</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              color="primary"
              value={filterType?.valueType}
              exclusive
              onChange={(event, newValue) => {
                if (newValue) {
                  setFilterType({ ...filterType, valueType: newValue });
                  getChartData(filterType?.chartType, newValue);
                }
              }}
            >
              <ToggleButton value={"quantidade"}>Quantidade</ToggleButton>
              <ToggleButton value={"valor"}>Valor</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="inputDateGroup">
            <TextFieldMask
              id="outlined-basic"
              variant="standard"
              size="small"
              type="date"
              value={filterDate?.startDate}
              onChange={(event) => {
                setFilterDate({ ...filterDate, startDate: event.target.value });
              }}
              focused
              label="A partir de:"
            />
            <Button
              onClick={setFilter}
              variant="contained"
              color="primary"
              size="small"
              sx={{ height: "40px" }}
            >
              Filtrar data
            </Button>
          </div>
        </DatePickerContainer>
      </DashboardHeaderContainer>
      <div style={{ width: "100%" }}>
        <ChartsContainer>
          <DynamicBarCharts
            series={chartData?.series}
            title={chartData?.title}
            xaxis={chartData?.xaxis}
          />
        </ChartsContainer>
      </div>
      <DynamicPieCharts
        series={[
          wonDeals.length || 0,
          lostDeals.length || 0,
          inProgressDeals.length || 0,
          archivedDeals.length || 0,
        ]}
      />
      <br />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {dealsInfo && (
          <DealsInfoCard
            meanvalue={dealsInfo?.meanValue}
            totalvalue={dealsInfo?.totalValue}
            totaldeals={dealsInfo?.totalDeals}
            meandays={dealsInfo?.meanDays}
          />
        )}

        {conversionRateInfo && (
          <ConversionRateCard
            conversionrate={conversionRateInfo?.conversionRate}
            totalwon={conversionRateInfo?.totalWon}
            totallost={conversionRateInfo?.totalLost}
            totalinprogress={conversionRateInfo?.totalInProgress}
            totalarchived={conversionRateInfo?.totalArchived}
          />
        )}
      </Box>

      <div style={{ width: "100%" }}>
        <ChartsContainer>
          {testLineChartData.series[0] && (
            <DynamicTestLineCharts series={testLineChartData?.series} />
          )}
        </ChartsContainer>
      </div>
    </DashboardPageContainer>
  );
}
export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  resolvedUrl,
}): Promise<any> => {
  const data = parseCookies(req);
  let token: string = "";
  let allDeals: any = [];

  Object.keys(data).find((key, i) => {
    if (key === "@target:token") {
      token = Object.values(data)[i];
    }
  });
  if (!token?.length && resolvedUrl !== "/login") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    try {
      serviceApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await serviceApi.get("/auth/faw1efawe3f14aw8es3v6awer51xx3/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await serviceApi.get(
        "/deal?with=pipeline,company,contact"
      );
      allDeals = data;
    } catch (e) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }
  return {
    props: {
      allDeals,
      token,
    },
  };
};
