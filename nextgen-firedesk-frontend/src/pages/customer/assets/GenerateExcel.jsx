import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Typography } from "@mui/material";

const GenerateExcel = () => {
  const handleGenerateExcel = async () => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bulk Upload");

    // Define headers
    const headers = [
      "partNo",
      "location",
      "building",
      "model",
      "capacity",
      "pressureRating",
      "pressureUnit(Kg/Cm2, PSI, MWC, Bar)",
      "moc",
      "approval",
      "manufacturingDate",
      "manufacturerName",
      "installDate",
      "tag",
      "status(Warranty, AMC, Deactive)",
      "fireClass(Only for Fire Extinguishers)",
      "type",
      "subType",
      "condition",
    ];

    // Add header row
    const headerRow = worksheet.addRow(headers);

    // Apply styling to the header row
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        bold: true,
        color: {
          argb:
            colNumber === 2 ||
            colNumber === 3 ||
            colNumber === 5 ||
            colNumber === 10 ||
            colNumber === 12 ||
            colNumber === 14 ||
            colNumber === 15 ||
            colNumber === 16
              ? "FF0000"
              : "000000",
        }, // Red for location & building
      };
      cell.alignment = { horizontal: "center" };
    });

    // Auto adjust column widths
    worksheet.columns = headers.map((header) => ({
      header,
      width: header.length + 5,
    }));

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save file
    saveAs(blob, "sample.xlsx");
  };

  return (
    <Typography
      variant="body2"
      color="secondary"
      sx={{
        cursor: "pointer",
        textDecoration: "underline",
        ml: "auto",
      }}
      onClick={handleGenerateExcel}
    >
      Download the Sample Excel File
    </Typography>
  );
};

export default GenerateExcel;
