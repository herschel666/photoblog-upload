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
  cfn.Resources.HTTP.Properties.Domain = {
    CertificateArn: { Ref: 'CertificateArn' },
    DomainName: { Ref: 'DomainName' },
    Route53: {
      HostedZoneId: { Ref: 'Zone' },
    },
  };

  return cfn;
};
