#define ARGTYPE Nan::FunctionCallbackInfo<v8::Value>
#define ARGVAR info

#if NODE_VERSION_AT_LEAST(6, 0, 0)
  #define PROP_SET(tpl, propname, propvalue) tpl->SetNativeDataProperty(Nan::New(propname).ToLocalChecked(), Rsvg::propGetter, 0, propvalue)
#else
  #define PROP_SET(tpl, propname, propvalue) tpl->Set(Nan::New(propname).ToLocalChecked(), propvalue)
#endif

#if NODE_MAJOR_VERSION <= 2
  #define CREATE_FUNC(func) Nan::New<Function>(func)->NewInstance(argc, argv)
  #define CREATE_OBJ() ObjectTemplate::New()
#else
  #define CREATE_FUNC(func) Nan::New<Function>(func)->NewInstance(Nan::GetCurrentContext(), argc, argv).ToLocalChecked()
  #define CREATE_OBJ() ObjectTemplate::New(Nan::GetCurrentContext()->GetIsolate())
#endif
