// validates that modules are passed correctly:
// 1. FundingManager, 2. Authorizer, 3. PaymentProcessor, 4. Array of logic modules
// const validateModule = (
//     moduleName: GenericModuleName,
//     moduleType: ModuleType
//   ) => {
//     const actualModuleType = data[moduleName]['v1.0'].moduleType
//     if (actualModuleType !== moduleType) {
//       throw Error(
//         `Invalid module type: expected ${moduleType} but received ${moduleName} which is of type ${actualModuleType}`
//       )
//     }
//   }
