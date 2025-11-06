// Import all flag components from react-flags-select and put them in an object for easy access
import {
    Af, Ax, Al, Dz, As, Ad, Ao, Ai, Ag, Ar, Am, Aw, Au, At, Az, Bs, Bh, Bd, Bb, By, Be, Bz, Bj,
    Bm, Bt, Bo, Ba, Bw, Br, Io, Bg, Bf, Bi, Kh, Cm, Ca, Cv, Ky, Cf, Td, Cl, Cn, Co, Km, Cg, Cd,
    Ck, Cr, Ci, Hr, Cu, Cw, Cy, Cz, Dk, Dj, Dm, Do, Ec, Eg, Sv, Gq, Er, Ee, Et, Fk, Fo, Fj, Fi,
    Fr, Pf, Ga, Gm, Ge, De, Gh, Gi, Gr, Gl, Gd, Gu, Gt, Gg, Gn, Gw, Ht, Hn, Hk, Hu, Is, In, Id,
    Ir, Iq, Ie, Im, Il, It, Jm, Jp, Je, Jo, Kz, Ke, Ki, Xk, Kw, Kg, La, Lv, Lb, Ls, Lr, Ly, Li,
    Lt, Lu, Mo, Mk, Mg, Mw, My, Mv, Ml, Mt, Mh, Mq, Mr, Mu, Mx, Fm, Md, Mc, Mn, Me, Ms, Ma, Mz,
    Mm, Na, Nr, Np, Nl, Nz, Ni, Ne, Ng, Nu, Nf, Kp, Mp, No, Om, Pk, Pw, Ps, Pa, Pg, Py, Pe, Ph,
    Pn, Pl, Pt, Pr, Qa, Ro, Ru, Rw, Kn, Lc, Ws, Sm, St, Sa, Sn, Rs, Sc, Sl, Sg, Sx, Sk, Si, Sb,
    So, Za, Kr, Ss, Es, Lk, Sd, Sr, Sz, Se, Ch, Sy, Tw, Tj, Tz, Th, Tl, Tg, Tk, To, Tt, Tn, Tr,
    Tm, Tc, Tv, Ug, Ua, Ae, Gb, Us, Uy, Uz, Vu, Ve, Vn, Vi, Ye, Zm, Zw
} from "react-flags-select";

// Build an object to map ISO codes to components
export const FLAG_COMPONENTS = {
    AF: Af, AX: Ax, AL: Al, DZ: Dz, AS: As, AD: Ad, AO: Ao, AI: Ai, AG: Ag, AR: Ar, AM: Am, AW: Aw,
    AU: Au, AT: At, AZ: Az, BS: Bs, BH: Bh, BD: Bd, BB: Bb, BY: By, BE: Be, BZ: Bz, BJ: Bj,
    BM: Bm, BT: Bt, BO: Bo, BA: Ba, BW: Bw, BR: Br, IO: Io, BG: Bg, BF: Bf, BI: Bi, KH: Kh, CM: Cm,
    CA: Ca, CV: Cv, KY: Ky, CF: Cf, TD: Td, CL: Cl, CN: Cn, CO: Co, KM: Km, CG: Cg, CD: Cd,
    CK: Ck, CR: Cr, CI: Ci, HR: Hr, CU: Cu, CW: Cw, CY: Cy, CZ: Cz, DK: Dk, DJ: Dj, DM: Dm, DO: Do,
    EC: Ec, EG: Eg, SV: Sv, GQ: Gq, ER: Er, EE: Ee, ET: Et, FK: Fk, FO: Fo, FJ: Fj, FI: Fi,
    FR: Fr, PF: Pf, GA: Ga, GM: Gm, GE: Ge, DE: De, GH: Gh, GI: Gi, GR: Gr, GL: Gl, GD: Gd,
    GU: Gu, GT: Gt, GG: Gg, GN: Gn, GW: Gw, HT: Ht, HN: Hn, HK: Hk, HU: Hu, IS: Is, IN: In,
    ID: Id, IR: Ir, IQ: Iq, IE: Ie, IM: Im, IL: Il, IT: It, JM: Jm, JP: Jp, JE: Je, JO: Jo,
    KZ: Kz, KE: Ke, KI: Ki, XK: Xk, KW: Kw, KG: Kg, LA: La, LV: Lv, LB: Lb, LS: Ls, LR: Lr,
    LY: Ly, LI: Li, LT: Lt, LU: Lu, MO: Mo, MK: Mk, MG: Mg, MW: Mw, MY: My, MV: Mv, ML: Ml,
    MT: Mt, MH: Mh, MQ: Mq, MR: Mr, MU: Mu, MX: Mx, FM: Fm, MD: Md, MC: Mc, MN: Mn, ME: Me,
    MS: Ms, MA: Ma, MZ: Mz, MM: Mm, NA: Na, NR: Nr, NP: Np, NL: Nl, NZ: Nz, NI: Ni, NE: Ne,
    NG: Ng, NU: Nu, NF: Nf, KP: Kp, MP: Mp, NO: No, OM: Om, PK: Pk, PW: Pw, PS: Ps, PA: Pa,
    PG: Pg, PY: Py, PE: Pe, PH: Ph, PN: Pn, PL: Pl, PT: Pt, PR: Pr, QA: Qa, RO: Ro, RU: Ru,
    RW: Rw, KN: Kn, LC: Lc, WS: Ws, SM: Sm, ST: St, SA: Sa, SN: Sn, RS: Rs, SC: Sc, SL: Sl,
    SG: Sg, SX: Sx, SK: Sk, SI: Si, SB: Sb, SO: So, ZA: Za, KR: Kr, SS: Ss, ES: Es, LK: Lk,
    SD: Sd, SR: Sr, SZ: Sz, SE: Se, CH: Ch, SY: Sy, TW: Tw, TJ: Tj, TZ: Tz, TH: Th, TL: Tl,
    TG: Tg, TK: Tk, TO: To, TT: Tt, TN: Tn, TR: Tr, TM: Tm, TC: Tc, TV: Tv, UG: Ug, UA: Ua,
    AE: Ae, GB: Gb, US: Us, UY: Uy, UZ: Uz, VU: Vu, VE: Ve, VN: Vn, VI: Vi, YE: Ye, ZM: Zm, ZW: Zw
};
