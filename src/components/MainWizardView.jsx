import { WizardContainer } from './WizardContainer';
import { WizardNavigation } from './WizardNavigation';
import { Step1MatchSetup } from './steps/Step1MatchSetup';
import { Step4StartPosition } from './steps/Step4StartPosition';
import { Step5Actions } from './steps/Step5Actions';
import { Step6QRCode } from './steps/Step6QRCode';
import { AllianceIcon } from './AllianceIcon';

export function MainWizardView({
  theme,
  currentMatch,
  currentStep,
  onStepChange,
  updateCurrentMatch,
  updateStartPositionField,
  startPositions,
  useInches,
  useDegrees,
  actionList,
  actionGroups,
  expandedGroup,
  setExpandedGroup,
  onAddAction,
  onMoveAction,
  onRemoveAction,
  onUpdateActionConfig,
  onClearAll,
  dragHandlers,
  getConfig,
  onDownload,
  matches,
  currentMatchId,
  onSelectMatchFromQRCode,
  canGoNext,
  onNext,
  onPrev,
  onSaveTemplate,
  onCloseTemplate
}) {
  return (
    <div 
      className="h-screen flex flex-col overflow-hidden touch-manipulation"
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
    >
      {/* Compact Mobile Header */}
      <header className="bg-white dark:bg-slate-900 shadow-lg flex-shrink-0 safe-top border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-3 py-2.5">
          {/* Close button for template editing */}
          {currentMatch?.isTemplate && (
            <button
              onClick={() => {
                if (window.confirm('Close template editor without saving?')) {
                  onCloseTemplate && onCloseTemplate();
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition min-h-[36px] min-w-[36px] touch-manipulation"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <div className={`text-center ${currentMatch?.isTemplate ? '' : 'flex-1'}`}>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
              FTC Autofig
            </h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-none flex items-center justify-center gap-1">
              {currentMatch?.isTemplate ? 'Default Template' : `Match #${currentMatch?.matchNumber || '?'}`} {'\u2022'}{' '}
              <AllianceIcon 
                alliance={currentMatch?.alliance} 
                className={`w-3 h-3 ${currentMatch?.alliance === 'red' ? 'text-red-600' : 'text-blue-600'}`}
              />
              {' '}{currentMatch?.alliance?.toUpperCase() || 'NONE'}
            </p>
          </div>

          {/* Spacer for alignment when close button is present */}
          {currentMatch?.isTemplate && (
            <div className="w-[36px]"></div>
          )}
        </div>
      </header>

      {/* Main Content - Full Screen Wizard */}
      <div className="flex-1 overflow-hidden">
        <WizardContainer currentStep={currentStep} onStepChange={onStepChange}>
          <Step1MatchSetup
            matchNumber={currentMatch?.matchNumber || 1}
            partnerTeam={currentMatch?.partnerTeam || ''}
            alliance={currentMatch?.alliance || 'red'}
            isTemplate={currentMatch?.isTemplate || false}
            onMatchNumberChange={(num) => updateCurrentMatch({ matchNumber: num })}
            onPartnerTeamChange={(team) => updateCurrentMatch({ partnerTeam: team })}
            onAllianceChange={(alliance) => updateCurrentMatch({ alliance })}
          />
          <Step4StartPosition
            startPosition={currentMatch?.startPosition || { type: 'front' }}
            onStartPositionChange={(pos) => updateCurrentMatch({ startPosition: pos })}
            startPositions={startPositions}
            onUpdateField={updateStartPositionField}
            useInches={useInches}
            useDegrees={useDegrees}
            isActive={currentStep === 1}
          />
          <Step5Actions
            actionList={actionList}
            actionGroups={actionGroups}
            expandedGroup={expandedGroup}
            setExpandedGroup={setExpandedGroup}
            onAddAction={onAddAction}
            onMoveAction={onMoveAction}
            onRemoveAction={onRemoveAction}
            onUpdateActionConfig={onUpdateActionConfig}
            onClearAll={onClearAll}
            dragHandlers={dragHandlers}
            isActive={currentStep === 2}
          />
          <Step6QRCode
            config={getConfig()}
            onDownload={onDownload}
            matches={matches}
            currentMatchId={currentMatchId}
            onSelectMatch={onSelectMatchFromQRCode}
          />
        </WizardContainer>
      </div>
      {/* Compact Bottom Navigation */}
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={4}
        onNext={onNext}
        onPrev={onPrev}
        canGoNext={canGoNext}
        nextLabel={currentStep === 3 ? 'Finish' : 'Next'}
      />

      {/* Save Template Button - Show when editing template */}
      {currentMatch?.isTemplate && (
        <div className="fixed bottom-16 right-4 z-40 safe-bottom">
          <button
            onClick={() => {
              if (window.confirm('Save changes to default template?')) {
                onSaveTemplate && onSaveTemplate();
              }
            }}
            className="flex items-center gap-2 py-3 px-5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-full font-semibold shadow-lg min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Template
          </button>
        </div>
      )}
    </div>
  );
}
