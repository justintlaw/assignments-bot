locals {
  domain_name = "jenkins.justincodes.dev"
  jenkins_origin_id = "jenkins-site"
}

resource "aws_route53_record" "jenkins_a" {
  zone_id = data.terraform_remote_state.certs.outputs.route53_main_zone_id
  name = local.domain_name
  type = "A"

  alias {
    # name = aws_cloudfront_distribution.jenkins_distro.domain_name
    name = aws_lb.jenkins_lb.dns_name
    # zone_id = aws_cloudfront_distribution.jenkins_distro.hosted_zone_id
    zone_id = aws_lb.jenkins_lb.zone_id
    evaluate_target_health = false
  }
}

resource "aws_cloudfront_distribution" "jenkins_distro" {
  origin {
    # domain_name = local.domain_name
    # domain_name = aws_eip.jenkins_eip.public_dns
    domain_name = aws_lb.jenkins_lb.dns_name
    origin_id = local.jenkins_origin_id

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled = true

  aliases = [local.domain_name]

  default_cache_behavior {
    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = local.jenkins_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations = ["CN", "RU", "IR", "KP"]
    }
  }

  viewer_certificate {
    # cloudfront_default_certificate = true
    acm_certificate_arn = data.terraform_remote_state.certs.outputs.ssl_cert_arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }
}