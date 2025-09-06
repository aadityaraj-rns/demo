const calculateNextServiceDate = (installDate, testFrequency) => {
    const installDateObj = new Date(installDate);
    let nextServiceDate;
  
    switch (testFrequency) {
      case "Weekly":
        nextServiceDate = new Date(
          installDateObj.setDate(installDateObj.getDate() + 7)
        );
        break;
      case "Fortnight":
        nextServiceDate = new Date(
          installDateObj.setDate(installDateObj.getDate() + 14)
        );
        break;
      case "Monthly":
        nextServiceDate = new Date(
          installDateObj.setMonth(installDateObj.getMonth() + 1)
        );
        break;
      case "Quarterly":
        nextServiceDate = new Date(
          installDateObj.setMonth(installDateObj.getMonth() + 3)
        );
        break;
      case "Half Year":
        nextServiceDate = new Date(
          installDateObj.setMonth(installDateObj.getMonth() + 6)
        );
        break;
      case "Yearly":
        nextServiceDate = new Date(
          installDateObj.setFullYear(installDateObj.getFullYear() + 1)
        );
        break;
      default:
        nextServiceDate = null;
    }
  
    return nextServiceDate;
  }

module.exports = { calculateNextServiceDate };
