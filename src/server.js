const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Node server connected in PORT ${PORT}`));
