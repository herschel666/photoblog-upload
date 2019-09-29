module.exports = (_, cfn) => {
  Object.keys(cfn.Resources)
    .filter((k) => cfn.Resources[k].Type === 'AWS::Serverless::Function')
    .forEach((lambda) => {
      cfn.Resources[`${lambda}LogGroup`] = {
        Type: 'AWS::Logs::LogGroup',
        DependsOn: [lambda],
        Properties: {
          LogGroupName: {
            'Fn::Sub': [
              '/aws/lambda/${lambda}',
              {
                lambda: {
                  Ref: lambda,
                },
              },
            ],
          },
          RetentionInDays: 14,
        },
      };
    });

  return cfn;
};
