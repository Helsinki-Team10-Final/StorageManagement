function Loading(params) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <lottie-player
          src="https://assets1.lottiefiles.com/packages/lf20_hutlkiuf.json"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px" }}
          loop
          autoplay
        ></lottie-player>
      </div>
    </>
  );
}

export default Loading;
