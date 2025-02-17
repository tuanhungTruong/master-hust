import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowForward } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<IoIosArrowForward />} {...props} />
))(({ theme }) => ({
  backgroundColor: "#DBD8FD",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  "@media (max-width: 640px)": {
    padding: theme.spacing(0.25),
  },
}));

const topics = [
  { title: "Cơ sở ngành", id: "XWxkGr9ti74QS1nqdM2A" },
  { title: "Chuyên ngành", id: "fUW2jooied2VR6EvfGYv" },
  { title: "Đại cương", id: "gtkxdlojGhsp3vhVfU19" },
  { title: "Các môn triết", id: "trZTdDTflyp0AAHCmZhj" },
  { title: "Thể chất", id: "8nONfgbkMBMrP4FmSAaV" }
];

export default function MyAccordion() {
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedTopic, setSelectedTopic] = React.useState("");
  const navigateTo = useNavigate()

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleSelectTopic = (title, id) => {
    setSelectedTopic(title);
    navigateTo(`/posts?page=1&topicId=${id}`)
  };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div className="flex gap-2 items-center text-lg font-bold">
            <span className="">
              <FaBookOpen />
            </span>
            <span className="hidden md:block">Chủ đề</span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-1">
            {topics.map((t) => (
              <div
                className={`cursor-pointer py-2 hover:bg-gray-200 rounded-lg px-4 transition-all flex justify-between items-center ${
                  selectedTopic === t.title ? "bg-gray-200 font-bold" : ""
                }`}
                key={t.title}
                onClick={() => handleSelectTopic(t.title, t.id)}
              >
                <span className="text-xs md:text-sm lg:text-base">
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
