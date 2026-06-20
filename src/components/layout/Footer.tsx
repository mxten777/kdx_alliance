import Link from 'next/link'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '@/components/icons/SocialIcons'
import { CONTACT } from '@/lib/constants/contact'

const footerLinks = {
  '플랫폼 서비스': [
    { label: '산단 소개', href: '/about' },
    { label: '행사/프로그램', href: '/events' },
    { label: '산업관광/견학', href: '/tours' },
    { label: '공간/시설', href: '/spaces' },
    { label: '참여기관', href: '/organizations' },
  ],
  '기업지원': [
    { label: '기업지원/공지', href: '/support' },
    { label: '지원사업 안내', href: '/support?category=subsidy' },
    { label: 'FAQ/민원안내', href: '/faq' },
    { label: '문의하기', href: '/contact' },
    { label: 'AI 안내 챗봇', href: '/ai-assistant' },
  ],
  '컨소시엄': [
    { label: '바이칼시스템즈', href: '/organizations' },
    { label: '스마트한', href: '/organizations' },
    { label: '스마트아이넷', href: '/organizations' },
    { label: '행정사법인 정유', href: '/organizations' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-[#C9A961]/15 bg-[#050B1A] text-slate-300">
      {/* 상단 골드 라인 */}
      <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
      {/* 격자 패턴 오버레이 */}
      <div className="absolute inset-0 cmv-pattern-grid opacity-25 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#0A1628] via-[#0F2959] to-[#1A4A8F] shadow-lg shadow-black/40 ring-1 ring-[#C9A961]/20">
                <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-[#C9A961]" />
                <span className="text-[11px] font-bold tracking-tighter text-white">CMV</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-white leading-tight tracking-tight">경주 문화선도산단</p>
                <p className="text-[10px] font-medium tracking-[0.18em] text-[#C9A961] leading-tight uppercase mt-0.5">Culture &amp; Mobility Valley</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              산업·문화·관광·스마트시티·AI·안전이 결합된 경주 문화선도산단 디지털 전환 통합 플랫폼입니다.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#C9A961] shrink-0 mt-0.5" />
                <span>{CONTACT.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#C9A961] shrink-0" />
                <span className="tabular-nums">{CONTACT.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#C9A961] shrink-0" />
                <span>{CONTACT.email}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A961]">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <span className="h-px w-0 bg-[#C9A961] transition-all duration-300 group-hover:w-3 group-hover:mr-2" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SNS 채널 */}
        <div className="mt-12 pt-8 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold tracking-[0.28em] text-[#C9A961] uppercase">Follow Us</span>
              <span className="h-px w-8 bg-[#C9A961]/40" />
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://pf.kakao.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오톡 채널"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-[#FEE500] hover:border-[#FEE500] transition-all"
              >
                <span className="text-[11px] font-black text-slate-400 group-hover:text-[#191919]">K</span>
              </a>
              <a
                href="https://blog.naver.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="네이버 블로그"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-[#03C75A] hover:border-[#03C75A] transition-all"
              >
                <span className="text-[11px] font-black text-slate-400 group-hover:text-white">N</span>
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="유튜브"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-[#FF0033] hover:border-[#FF0033] transition-all"
              >
                <YoutubeIcon className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-linear-to-tr hover:from-[#FFD600] hover:via-[#F50057] hover:to-[#7C4DFF] hover:border-transparent transition-all"
              >
                <InstagramIcon className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="페이스북"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-[#1877F2] hover:border-[#1877F2] transition-all"
              >
                <FacebookIcon className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
              <Link
                href="/#newsletter"
                aria-label="뉴스레터 구독"
                className="group ml-2 flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#C9A961]/40 bg-[#C9A961]/10 text-[#E8D4A1] hover:bg-[#C9A961] hover:text-[#0A1628] transition-all text-xs font-semibold"
              >
                <Mail className="h-3.5 w-3.5" />
                뉴스레터
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2026 경주 문화선도산단 | Baikal Systems Consortium. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Powered by</span>
            <span className="text-slate-300 font-medium">바이칼시스템즈</span>
            <Link href="/admin/login" className="flex items-center gap-1 text-slate-500 hover:text-[#C9A961] transition-colors">
              <ExternalLink className="h-3 w-3" />
              관리자 로그인
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
