const sendMessage = () => setTimeout(() => {
  try {
    document.dispatchEvent(
      new CustomEvent(
        'bv_obj_retrieved',
        {
          detail: JSON.stringify(getBVObject())
        }
      )
    );
  }
  catch (e) {
    sendMessage();
  }
}, 1500);

const getBVObject = () => {
  const {
    BV: {
      global: {
        dataEnvironment: dataEnv,
        serverEnvironment: serverEnv,
        client,
        locale,
        siteId,
        SystemJS
      }
    }
  } = window;
  const copy = {
    ...BV,
    global: {
      dataEnv,
      serverEnv,
      client,
      locale,
      siteId,
      SystemJS
    }
  }
  return copy;
}

sendMessage();
