import { ChainId } from '@uniswap/sdk'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import Logo from '../../assets/images/logo.png'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { YellowCard } from '../Card'
import Settings from '../Settings'

import { CommonHeader } from 'scroll-common-header'

import React, { useEffect, useState } from 'react'
import { DOMAIN_STAGING } from '../../constants'
import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'

console.debug(React.version)

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  // position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`
const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.SCROLL_L2_TESTNET]: 'Scroll L2'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const [darkMode] = useDarkModeManager()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const [headerType, setHeaderType] = useState<any>(undefined)

  useEffect(() => {
    const pathHeaderDomains = [DOMAIN_STAGING, 'localhost']
    const isPath = pathHeaderDomains.some(path => ~window.location.href.indexOf(path))
    if (isPath) {
      setHeaderType('path')
    } else {
      setHeaderType('subdomain')
    }
  }, [])

  return (
    <div style={{ display: 'block', width: '100%' }}>
      <CommonHeader activeTab="Swap" backgroundColor="#fff" type={headerType}></CommonHeader>
      <HeaderFrame>
        <RowBetween
          style={{ alignItems: 'flex-start', justifyContent: 'end', paddingTop: 0, marginTop: '40px' }}
          padding="1rem 1rem 0 1rem"
        >
          <HeaderElement style={{ display: 'none' }}>
            {/* TODO: ENV */}
            <Title href="https://staging-prealpha.scroll.io" style={{ textDecoration: 'none' }}>
              <UniIcon>
                <img src={Logo} style={{ width: '50px' }} alt="logo" />
              </UniIcon>
            </Title>
            <Title href="." style={{ textDecoration: 'none' }}>
              <Text
                style={{ color: darkMode ? '#fff' : '#000', fontWeight: 500, fontSize: '20px', paddingLeft: '6px' }}
              >
                Scroll Swap
              </Text>
            </Title>
          </HeaderElement>
          <HeaderControls>
            <HeaderElement>
              <TestnetWrapper>
                {!isMobile && chainId && NETWORK_LABELS[chainId] && (
                  <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>
                )}
              </TestnetWrapper>
              <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && userEthBalance ? (
                  <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                    {userEthBalance?.toSignificant(4)} ETH
                  </BalanceText>
                ) : null}
                <Web3Status />
              </AccountElement>
            </HeaderElement>
            <HeaderElementWrap>
              <Settings />
            </HeaderElementWrap>
          </HeaderControls>
        </RowBetween>
      </HeaderFrame>
    </div>
  )
}
