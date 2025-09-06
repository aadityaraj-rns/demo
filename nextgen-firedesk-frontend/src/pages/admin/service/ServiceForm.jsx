import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  IconButton,
  Checkbox,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  addQuestionsToSection,
  getServiceById,
  removeQuestionsFromSection,
} from "../../../api/admin/internal";
import Spinner from "../spinner/Spinner";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    to: "/service",
    title: "Service",
  },
  {
    title: "Service Form",
  },
];

const ServiceForm = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [newQuestions, setNewQuestions] = useState([""]);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await getServiceById(id);
      setService(response.data.service);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  const handleAddQuestion = async (sectionName) => {
    try {
      const payload = {
        formId: id,
        sectionName,
        questions: newQuestions.filter((q) => q.trim() !== ""),
      };
      const response = await addQuestionsToSection(payload);
      setService(response.data);
      setNewQuestions([""]);
      setIsAdding(false);
      setActiveSection(null);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestions = async (sectionName) => {
    try {
      const payload = {
        formId: id,
        sectionName,
        questionIds: selectedQuestions,
      };
      const response = await removeQuestionsFromSection(payload);
      setService(response.data);
      setSelectedQuestions([]);
      setIsDeleting(false);
      setActiveSection(null);
    } catch (error) {
      console.error("Error deleting questions:", error);
    }
  };

  const handleNewQuestionChange = (index, value) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[index] = value;
    setNewQuestions(updatedQuestions);
  };

  const handleAddNewQuestionField = () => {
    setNewQuestions([...newQuestions, ""]);
  };

  const handleRemoveNewQuestionField = (index) => {
    const updatedQuestions = newQuestions.filter((_, i) => i !== index);
    setNewQuestions(updatedQuestions);
  };

  const handleToggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  if (!service) {
    return <Spinner />;
  }

  const styles = {
    paperContainer: {
      padding: "20px",
      marginTop: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      fontSize: "28px",
      color: "#333",
      marginBottom: "20px",
    },
    sectionHeading: {
      marginTop: "20px",
      fontSize: "22px",
      color: "#007bff",
      borderBottom: "2px solid #007bff",
      paddingBottom: "8px",
      marginBottom: "15px",
    },
    questionList: {
      listStyleType: "none",
      paddingLeft: "0",
    },
    questionListItem: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "5px",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
    },
    questionText: {
      margin: "0",
      color: "#555",
    },
    questionNumber: {
      fontWeight: "bold",
      marginRight: "5px",
    },
    button: {
      padding: "10px 20px",
      margin: "10px 10px 10px 0",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    buttonSecondary: {
      backgroundColor: "#dc3545",
      marginTop: "10px",
    },
    buttonSecondaryHover: {
      backgroundColor: "#c82333",
    },
    iconButton: {
      marginLeft: "10px",
    },
    iconButtonSvg: {
      color: "#007bff",
      transition: "color 0.3s ease",
    },
    iconButtonHoverSvg: {
      color: "#0056b3",
    },
    checkbox: {
      marginRight: "10px",
    },
    textField: {
      width: "calc(100% - 22px)",
      padding: "10px",
      marginTop: "8px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "16px",
      boxSizing: "border-box",
      transition: "border-color 0.3s ease",
      backgroundColor: "#f9f9f9",
    },
    textFieldFocus: {
      borderColor: "#007bff",
      outline: "none",
    },
  };

  return (
    <PageContainer title="Service" description="this is Service edit page">
      <Breadcrumb title="Service" items={BCrumb} />
      <Paper style={styles.paperContainer}>
        <Typography variant="h4" style={styles.heading} gutterBottom>
          {service.serviceName}
        </Typography>
        {service.sectionName.map((section) => (
          <div key={section._id}>
            <Typography variant="h5" style={styles.sectionHeading} gutterBottom>
              {section.name}
            </Typography>
            <List style={styles.questionList}>
              {section.questions.map((question, index) => (
                <div key={question._id}>
                  <ListItem style={styles.questionListItem}>
                    {isDeleting && (
                      <Checkbox
                        style={styles.checkbox}
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() =>
                          handleToggleQuestionSelection(question._id)
                        }
                      />
                    )}
                    <Typography component="span" style={styles.questionNumber}>
                      {index + 1}.
                    </Typography>
                    <ListItemText primary={question.question} />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
            {isAdding && activeSection === section.name && (
              <div>
                {newQuestions.map((newQuestion, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <TextField
                      label={`New Question ${index + 1}`}
                      value={newQuestion}
                      onChange={(e) =>
                        handleNewQuestionChange(index, e.target.value)
                      }
                      fullWidth
                      style={styles.textField}
                      InputProps={{
                        style: styles.textFieldFocus,
                      }}
                    />
                    {newQuestions.length > 1 && (
                      <IconButton
                        style={styles.iconButton}
                        onClick={() => handleRemoveNewQuestionField(index)}
                      >
                        <RemoveCircleOutlineIcon style={styles.iconButtonSvg} />
                      </IconButton>
                    )}
                  </div>
                ))}
                <Button
                  sx={{ my: 1 }}
                  variant="contained"
                  color="secondary"
                  onClick={handleAddNewQuestionField}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Add Another Question
                </Button>
                <Button
                  sx={{ mx: 1, my: 1 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAddQuestion(section.name)}
                >
                  Add Questions
                </Button>
              </div>
            )}
            {isDeleting && activeSection === section.name && (
              <Button
                sx={{ mx: 1 }}
                color="error"
                variant="contained"
                onClick={() => handleDeleteQuestions(section.name)}
              >
                Delete Selected Questions
              </Button>
            )}
            <Button
              sx={{ mx: 1 }}
              variant="contained"
              color="secondary"
              onClick={() => {
                setIsAdding(!isAdding);
                setActiveSection(section.name);
                setIsDeleting(false);
              }}
            >
              {isAdding && activeSection === section.name
                ? "Cancel"
                : "Add Question"}
            </Button>
            <Button
              sx={{ mx: 1 }}
              className="secondary"
              variant="contained"
              onClick={() => {
                setIsDeleting(!isDeleting);
                setActiveSection(section.name);
                setIsAdding(false);
              }}
            >
              {isDeleting && activeSection === section.name
                ? "Cancel"
                : "Delete Questions"}
            </Button>
          </div>
        ))}
      </Paper>
    </PageContainer>
  );
};

export default ServiceForm;
