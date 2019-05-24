const sendMessage = type => new Promise(resolve => setTimeout(() => {
  const is$ = type === '$';
  try {
    document.dispatchEvent(
      new CustomEvent(
        `${is$ ? '$': ''}bv_obj_retrieved`,
        {
          detail: JSON.stringify(is$ ? get$BVObject() : getBVObject())
        }
      )
    );
    resolve();
  }
  catch (e) {
    console.error(e);
  }
}, 1500));

const getBVObject = () => {
  const { BV } = window;

  if (!BV) {
    return;
  }

  const { global, options } = BV;

  let dataEnv, serverEnv, client, locale, siteId, SystemJS;

  if (global) {

    dataEnv = global.dataEnvironment;
    serverEnv = global.serverEnvironment;
    client = global.client;
    locale = global.locale;
    siteId = global.siteId;
    SystemJS = global.SystemJS;
  }

  return {
    global: {
      dataEnv,
      serverEnv,
      client,
      locale,
      siteId,
      SystemJS
    },
    options: {
      ...options
    },
    pixel: BV.pixel,
    _render: BV._render
  }
}

const get$BVObject = () => {
  const { $BV } = window;

  if (!$BV) {
    return;
  }

  let _baseUrl, isPRR = false, anonymous, autoTagEnabled, brandDomain, isEU, prrEnv;

  const { Internal } = $BV;

  if (Internal) {
    _baseUrl = Internal._baseUrl;
    isPRR = Internal.isPRR;

    const { _magpieSettings } = Internal;

    if (_magpieSettings) {
      anonymous = _magpieSettings.anonymous;
      autoTagEnabled = _magpieSettings.autoTagEnabled;
      brandDomain = _magpieSettings.brandDomain;
      isEU = _magpieSettings.isEU;
      prrENV = _magpieSettings.prrENV;
    }
  }

  return {
    ...window.$BV,
    Internal: {
      _baseUrl,
      isPRR
    },
    _magpieSettings: {
      anonymous,
      autoTagEnabled,
      brandDomain,
      isEU,
      prrEnv
    }
  };
}

sendMessage().then(() => sendMessage('$'));
