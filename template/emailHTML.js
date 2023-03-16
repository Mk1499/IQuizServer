export const htmlTemp = (code) => {
  // <img
  // src="https://firebasestorage.googleapis.com/v0/b/booky-a6a30.appspot.com/o/logoName.png?alt=media&token=61a25be6-b57e-4208-a74e-99ad2ff69d61"
  // />
  return `
    <div style="text-align:center">
        <h1 style="font-family:Roboto;color:'grey'"> Your Verfication Code is 
            <span style="color:#fe2e53">
            ${code}
            </span>
        </h1>
    </div>
    `;
};
