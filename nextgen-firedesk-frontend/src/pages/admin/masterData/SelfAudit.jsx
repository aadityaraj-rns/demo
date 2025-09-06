import  { useEffect, useRef, useState } from "react";
import PageContainer from "../../../components/container/PageContainer";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { getAllSelfAudits, editSelfAudit } from "../../../api/admin/internal";
import Toaster from "../../../components/toaster/Toaster";
import { Button, Box } from "@mui/material";
import DownloadableComponent from "../../../components/admin/masterData/selfAudit/SelfAuditDownloadView";
import html2pdf from "html2pdf.js";
import { IconPlus, IconTrash } from "@tabler/icons";
import {  useNavigate } from "react-router-dom";

const SelfAudit = () => {
  const [selfAuditQuestions, setSelfAuditQuestions] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newQuestions, setNewQuestions] = useState({});
  const [newCategoryName, setNewCategoryName] = useState(""); // For new category input
  const navigate = useNavigate();

  const componentRef = useRef();

  const handleDownload = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.2,
      filename: "self_audit_component.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().from(element).set(opt).save();
  };

  const fetchSelfAudits = async () => {
    const response = await getAllSelfAudits();
    if (response.status === 200) {
      setSelfAuditQuestions(response.data.selfAuditQuestions || {});
      setEditedData(response.data.selfAuditQuestions || {});
    }
  };

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Self Audit Questions",
    },
  ];

  useEffect(() => {
    fetchSelfAudits();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewQuestions({});
  };

  

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData(selfAuditQuestions);
    fetchSelfAudits();
  };

  const handleInputChange = (categoryIndex, questionIndex, field, value) => {
    const updatedData = { ...editedData };
    updatedData.categories[categoryIndex].questions[questionIndex][field] =
      value;
    setEditedData(updatedData);
  };

  const handleCategoryChange = (categoryIndex, value) => {
    const updatedData = { ...editedData };
    updatedData.categories[categoryIndex].categoryName = value;
    setEditedData(updatedData);
  };

  const handleAddNewQuestion = (categoryIndex) => {
    const updatedData = { ...editedData };
    const newQuestion = {
      questionText: newQuestions[categoryIndex] || "",
      questionType: "Yes/No",
    };
    updatedData.categories[categoryIndex].questions.push(newQuestion);
    setEditedData(updatedData);
    setNewQuestions((prev) => ({
      ...prev,
      [categoryIndex]: "",
    }));
  };

  const handleRemoveCategory = (categoryIndex) => {
    const updatedData = { ...editedData };
    updatedData.categories.splice(categoryIndex, 1);
    setEditedData(updatedData);
  };

  const handleAddCategory = () => {
    const updatedData = { ...editedData };
    const newCategory = {
      categoryName: newCategoryName || "New Category",
      questions: [],
    };
    updatedData.categories.push(newCategory);
    setEditedData(updatedData);
    setNewCategoryName("");
  };

  const removeIds = (data) => {
    const cleanedData = { ...data };
    delete cleanedData.createdAt;
    delete cleanedData.updatedAt;
    delete cleanedData.__v;

    cleanedData.categories = cleanedData.categories.map((category) => {
      const { _id, createdAt, updatedAt, __v, ...categoryWithoutId } = category;
      categoryWithoutId.questions = categoryWithoutId.questions.map(
        (question) => {
          const { _id, createdAt, updatedAt, __v, ...questionWithoutId } =
            question;
          return questionWithoutId;
        }
      );
      return categoryWithoutId;
    });
    return cleanedData;
  };

  const handleSaveClick = async () => {
    const dataToSend = removeIds(editedData);

    try {
      const response = await editSelfAudit(selfAuditQuestions._id, dataToSend);
      if (response.status === 200) {
        setSelfAuditQuestions(response.data.updatedSelfAudit);
        setIsEditing(false);
        Toaster.success("Self Audit updated successfully");
      }
    } catch (error) {
      Toaster.error("Failed to update Self Audit");
    }
  };

  if (!selfAuditQuestions || !selfAuditQuestions.categories) {
    return (
      <PageContainer title="Self Audit" description="this is Self Audit page">
        <Breadcrumb title="Self Audit" items={BCrumb} />
        <p>No self-audit data available.</p>
      </PageContainer>
    );
  }
  const handleView = () => {
    const selfAuditQuestions = editedData; // Get your data here
    navigate("/masterData/selfAudit/view-audit", { state: { data: selfAuditQuestions,} });
  };

  const styles = {
    selfAuditContainer: {
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    category: {
      marginBottom: "20px",
    },
    categoryInput: {
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryName: {
      fontSize: "22px",
      color: "#007bff",
      borderBottom: "2px solid #007bff",
      paddingBottom: "8px",
      paddingLeft: "8px",
      marginBottom: "15px",
      flex: 1,
    },
    question: {
      backgroundColor: "#fff",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "5px",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    select: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      margin: "10px 10px 10px 0",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#064385",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    buttonSecondary: {
      padding: "10px 20px",
      margin: "10px 0",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#ac1a29",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonSecondaryHover: {
      backgroundColor: "#e63849",
    },
    selfAuditHeading: {
      textAlign: "center",
      fontSize: "34px",
      color: "#333",
      marginBottom: "20px",
    },
  };

  return (
    <PageContainer title="Self Audit" description="this is Self Audit page">
      <Breadcrumb title="Self Audit" items={BCrumb} />
      <div style={styles.selfAuditContainer}>
        <h2 style={styles.selfAuditHeading}>Self Audit Questions</h2>
        <Box display="flex" justifyContent="flex-end" pb={1}>
          {!isEditing && (
            <Button
              onClick={handleEditClick}
              variant="contained" color="secondary"
            >
              Edit
            </Button>
          )}
          <Button onClick={handleView} variant="contained" color="secondary" sx={{ mx: 2 }}>
            View
          </Button>
          <Button onClick={handleDownload}>Download PDF</Button>
        </Box>
        <div style={{ display: "none" }}>
          <DownloadableComponent ref={componentRef} data={selfAuditQuestions} />
        </div>
        {selfAuditQuestions.categories.map((category, categoryIndex) => (
          <div key={category._id} style={styles.category}>
            {isEditing ? (
              <div key={category._id} style={styles.categoryInput}>
                <input
                  type="text"
                  value={editedData.categories[categoryIndex].categoryName}
                  onChange={(e) =>
                    handleCategoryChange(categoryIndex, e.target.value)
                  }
                  style={styles.input}
                />
                {/* Add remove button (trash icon) next to category when editing */}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(categoryIndex)}
                  style={{ ...styles.buttonSecondary }}
                >
                  <IconTrash size={16} />
                </button>
              </div>
            ) : (
              <h3 style={styles.categoryName}>{category.categoryName}</h3>
            )}
            <ul>
              {category.questions.map((question, questionIndex) => (
                <li key={question._id} style={styles.question}>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={
                          editedData.categories[categoryIndex].questions[
                            questionIndex
                          ].questionText
                        }
                        onChange={(e) =>
                          handleInputChange(
                            categoryIndex,
                            questionIndex,
                            "questionText",
                            e.target.value
                          )
                        }
                        style={styles.input}
                      />
                      <select
                        value={
                          editedData.categories[categoryIndex].questions[
                            questionIndex
                          ].questionType
                        }
                        onChange={(e) =>
                          handleInputChange(
                            categoryIndex,
                            questionIndex,
                            "questionType",
                            e.target.value
                          )
                        }
                        style={styles.select}
                      >
                        <option value="Yes/No">Yes/No</option>
                        <option value="Input">Input</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveQuestion(categoryIndex, questionIndex)
                        }
                        style={{ ...styles.buttonSecondary }}
                      >
                        <IconTrash size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Question:</strong> {question.questionText}
                      </p>
                      <p>
                        <strong>Type:</strong> {question.questionType}
                      </p>
                    </>
                  )}
                </li>
              ))}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleAddNewQuestion(categoryIndex)}
                  style={styles.button}
                >
                  <IconPlus />
                  Question
                </button>
              )}
            </ul>
          </div>
        ))}

        {isEditing && (
          <>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
              style={styles.input}
            />
            <button onClick={handleAddCategory} style={styles.button}>
              <IconPlus size={16} /> Section
            </button>
          </>
        )}

        {isEditing ? (
          <div>
            <button
              onClick={handleSaveClick}
              style={{ ...styles.button, marginRight: "10px" }}
            >
              Save
            </button>
            <button onClick={handleCancelClick} style={styles.buttonSecondary}>
              Cancel
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </PageContainer>
  );
};

export default SelfAudit;
