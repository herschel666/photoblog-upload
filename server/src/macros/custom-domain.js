const API_GATEWAY_ZONE_ID = 'Z2FDTNDATAQYW2';

module.exports = (_, cfn, stage) => {
  cfn.Parameters = {
    ...cfn.Parameters,
    Stage: {
      Type: 'String',
      Default: stage,
    },
    DomainName: {
      Type: 'String',
      Default: process.env.TLD,
    },
    Zone: {
      Type: 'String',
      Default: process.env.HOSTED_ZONE_ID,
    },
    CertificateArn: {
      Type: 'String',
      Default: process.env.CERTIFICATE_ARN,
    },
  };

  cfn.Resources.CustomDomainName = {
    Type: 'AWS::ApiGateway::DomainName',
    Properties: {
      DomainName: { Ref: 'DomainName' },
      CertificateArn: { Ref: 'CertificateArn' },
      EndpointConfiguration: {
        Types: ['EDGE'],
      },
    },
  };
  cfn.Resources.DomainRecordSet = {
    Type: 'AWS::Route53::RecordSet',
    Properties: {
      Name: { Ref: 'DomainName' },
      HostedZoneId: { Ref: 'Zone' },
      Type: 'A',
      AliasTarget: {
        DNSName: {
          'Fn::GetAtt': ['CustomDomainName', 'DistributionDomainName'],
        },
        HostedZoneId: API_GATEWAY_ZONE_ID,
      },
    },
  };
  cfn.Resources.BasePathMapping = {
    Type: 'AWS::ApiGateway::BasePathMapping',
    Properties: {
      BasePath: '(none)',
      DomainName: { Ref: 'DomainName' },
      RestApiId: { Ref: 'PhotoblogUploadServer' },
      Stage: { Ref: 'Stage' },
    },
  };

  cfn.Resources.PhotoblogUploadServer.Properties.EndpointConfiguration = 'EDGE';

  return cfn;
};
